
import { Entity, Property, Unique, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";


@Entity()
export class Match {

	// The person who performed the match/swiped right
	@ManyToOne({primary: true})
	owner!: User;

	// The account whose profile was swiped-right-on
	@ManyToOne({primary: true})
	matchee!: User;

	@Property()
	created_at = new Date();

}


