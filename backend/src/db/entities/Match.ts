import { Entity, Property, Unique, ManyToOne } from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";
import { DoggrBaseEntity } from "./DoggrBaseEntity.js";
import { User } from "./User.js";

@SoftDeletable(() => Match, "deleted_at", () => new Date())
@Entity()
export class Match {
	// The person who performed the match/swiped right
	@ManyToOne({ primary: true })
	owner!: User;

	// The account whose profile was swiped-right-on
	@ManyToOne({ primary: true })
	matchee!: User;

	@Property()
	created_at = new Date();

	@Property({ nullable: true })
	deleted_at?: Date;
}
