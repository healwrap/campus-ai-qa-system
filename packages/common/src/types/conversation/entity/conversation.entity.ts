import type { Message } from "./message.entity";
import type { User } from "../../user/entity/user.entity";

export interface Conversation {
	id: number;
	title: string;
	userId: number;
	user?: User;
	createdAt: Date;
	updatedAt: Date;
	messages?: Message[];
}
