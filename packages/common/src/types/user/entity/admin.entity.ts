export interface Admin {
	id: number;
	email: string;
	username: string;
	password?: string; // Optional on client side
	createdAt: Date;
	updatedAt: Date;
}
