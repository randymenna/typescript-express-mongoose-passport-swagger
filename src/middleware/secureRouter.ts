import express from 'express';
import { verifyAndExtractJwtToken } from 'src/security/jwtToken';

/**
 * Middleware function that will make sure the Authorization Bearer token is valid, and make the token payload
 * available to requests further down the line.
 *
 * @param req
 * @param res
 * @param next
 */
const validateJwtToken = async (req: express.Request, res: express.Response, next: Function) => {
	const authorization = req.get('Authorization');

 if (authorization) {
		try {
			// const jwtTokenPayload = await verifyAndExtractJwtToken(authorization);

			/**
			 * Once token is validated, we set it as the "validatedJwtToken" property on the request object
			 * and let the route be handled by the appropriate functions.
			 *
			 * All the data we set in createJwtToken's jwtClaimSet is available here
			 */
			// @ts-ignore
			// req.validatedJWtToken = jwtTokenPayload;

			next();
		} catch (error) {
			console.log(`Failed to validate Jwt Token`);

			console.error(error);

			// Give as little information as possible to potential hackers!
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(401);
	}
};

/**
 * Set up and export the secured router.
 */
const _securedRouter = express.Router();

_securedRouter.use(validateJwtToken);

export const securedRouter = _securedRouter;
