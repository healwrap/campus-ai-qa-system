import type { Conversation } from "../../conversation/entity/conversation.entity";

export interface User {
	id: number;
	email: string;
	username: string;
	password?: string; // Optional on client side
	realName?: string;
	gender?: string;
	age?: number;
	highSchool?: string;
	createdAt: Date;
	updatedAt: Date;
	conversations?: Conversation[];
}
