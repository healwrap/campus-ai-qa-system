type Fish = {
	swim: string;
};

type Bird = {
	fly: string;
};

function isFish(pet: Fish | Bird): pet is Fish {
	return (pet as Fish).swim !== undefined;
}

const res = isFish({ swim: "123" });

