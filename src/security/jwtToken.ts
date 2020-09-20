import * as jose from 'node-jose';

const accessKeySecret = process.env.OIDC_ACCESS_KEY_SECRET;
const expirationTimeSeconds = 24 * 60 * 60;
const expirationTimeMillis = expirationTimeSeconds * 1000;

const getJWKKey = () => {
	const keyJson = {
		kty: 'oct',
		use: 'sig',
		k: accessKeySecret,
		alg: 'HS256',
	};

	// generate the key from the base64 encoded key
	return new Promise((resolve, reject) => {
		jose.JWK.asKey(keyJson, 'json')
			.then((key) => {
				resolve(key);
			}).catch((error) => {
			reject(error);
		});
	});
};

/**
 * Creates and signs a JWT token for the specified user.
 *
 * @param userInfo
 * @param res
 * @param next
 */
export const createJwtToken = async (userInfo: any) => {
	if (!userInfo.email || !userInfo.sub) {
		throw new Error(`Invalid userInfo object! ${JSON.stringify(userInfo)}`);
	}
	const jwtClaimSet = {
		iss: 'yard-map-config-server',
		sub: userInfo.sub,
		aud: 'yard-map-web-app',
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + (expirationTimeSeconds),
		email: userInfo.email,
	};

	const jwtToken = await new Promise(async (resolve, reject) => {
		const key = await getJWKKey();
		// key is the converted jose.JWK.Key instance
		// sign the input and callback with the token
		// @ts-ignore
		jose.JWS.createSign({format: 'compact', alg: 'HS256'}, key)
			.update(jose.util.asBuffer(JSON.stringify(jwtClaimSet)))
			.final()
			.then((clientAssertion) => {
				resolve(clientAssertion);
			})
			.catch((error) => {
				reject(error);
			});
	});

	console.log(`Created JWT Token for ${userInfo.email}`);

	return jwtToken;
};

/**
 * Verifies the signature for the incoming request and extracts the user's e-mail setting it to the req object.
 *
 * @param authorizationHeaderValue i.e. 'Bearer eyXXXXXX'
 */
export const verifyAndExtractJwtToken = async (authorizationHeaderValue: any) => {
	const key: any = await getJWKKey();

	const headerSplit = authorizationHeaderValue.split(' ');

	if (headerSplit.length !== 2) {
		throw new Error('Invalid Authorization header');
	}

	if (headerSplit[0] !== 'Bearer') {
		throw new Error('Invalid Authorization header');
	}

	const jwtToken = headerSplit[1];

	return new Promise((resolve, reject) => {
		jose.JWS.createVerify(key)
			.verify(jwtToken)
			// {result} is a Object with:
			// *  header: the combined 'protected' and 'unprotected' header members
			// *  payload: Buffer of the signed content
			// *  signature: Buffer of the verified signature
			// *  key: The key used to verify the signature
			.then((result) => {
				// @ts-ignore
				const decoded = Buffer.from(result.payload, 'base64').toString();
				const decodedJson = JSON.parse(decoded);
				const epochTimeSeconds = Date.now() / 1000;

				// Make sure the token hasn't expired.
				if (decodedJson.exp && decodedJson.exp > epochTimeSeconds) {
					resolve(decodedJson);
				} else {
					reject('Token has expired');
				}

			})
			.catch((error) => {
				reject(error);
			});
	});
};
