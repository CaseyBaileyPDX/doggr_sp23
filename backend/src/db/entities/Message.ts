import { Entity, Property, ManyToOne, Cascade } from "@mikro-orm/core";
import { DoggrBaseEntity } from "./DoggrBaseEntity.js";
import { User } from "./User.js";

@Entity()
export class Message extends DoggrBaseEntity {

	// The person who performed the match/swiped right
	// Delete this message if they are deleted
	@ManyToOne(
		() => User,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	sender!: User;

	// The account whose profile was swiped-right-on
	// Delete this message if they are deleted
	@ManyToOne(
		() => User,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	receiver!: User;

	@Property()
	message!: string;
}
