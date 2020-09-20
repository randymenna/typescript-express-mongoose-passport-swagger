export const insertUnique = (array: any, content: any) => {
	if (!array) {
		array = [content];
	} else {
		if (array.indexOf(content) === -1) {
			array.push(content);
		}
	}
 return array;
};

export const removeFromArray = (array: any, content: any) => {
	if (array) {
		const copy = [...array];
		const index = copy.indexOf(content);
		if (index !== -1) {
			copy.splice(index);
		}
		return copy;
	}
	return [];
};

export const overWriteOrAdd = (uniqueKey: any, objectArray: any, newObject: any) => {
	const copy = objectArray.slice(0);
	const index = copy.findIndex((val: any) => {
		return (val[uniqueKey] === newObject[uniqueKey]);
	});
	if (index !== -1) {
		copy[index] = newObject;
	} else {
		copy.push(newObject);
	}
	return copy;
};

export const removeObjectFromArray = (objectArray: any, key: any, value: any) => {
	if (objectArray) {
		const copy = objectArray.slice(0);
		const index = copy.findIndex((val: any) => {
			// tslint:disable-next-line:triple-equals
			return (val[key] == value);
		});
		if (index !== -1) {
			copy.splice(index);
		}
		return copy;
	}
	return [];
};
