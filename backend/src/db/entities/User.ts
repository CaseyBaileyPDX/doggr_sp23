import { Entity, Property, Unique, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";
import { DoggrBaseEntity } from "./DoggrBaseEntity.js";
import { Match } from "./Match.js";

import { Enum } from "@mikro-orm/core";
import { Message } from "./Message.js";
import { Pass } from "./Pass.js";

export enum UserRole {
	ADMIN = 'Admin',
	USER = 'User'
}

// https://github.com/TheNightmareX/mikro-orm-soft-delete
// Yes, it's really that easy.
@SoftDeletable(() => User, "deleted_at", () => new Date())
@Entity({ tableName: "users"})
export class User extends DoggrBaseEntity {
	@Property()
	@Unique()
	email!: string;
	
	@Property()
	name!: string

	@Property()
	password!: string;

	@Property()
	petType!: string;

	@Enum(() => UserRole)
	role!: UserRole; // string enum

	@Property({fieldName: 'img_uri'})
	imgUri!: string;

	// Note that these DO NOT EXIST in the database itself!
	@OneToMany(
		() => Match,
		match => match.owner,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	matches!: Collection<Match>;

	@OneToMany(
		() => Match,
		match => match.matchee,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	matched_by!: Collection<Match>;

	@OneToMany(
		() => Pass,
		pass => pass.owner,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	passes!: Collection<Pass>;

	@OneToMany(
		() => Match,
		pass => pass.matchee,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE]}
	)
	passed_by!: Collection<Pass>;

	// Orphan removal used in our Delete All Sent Messages route to single-step remove via Collection
	@OneToMany(
		() => Message,
		message => message.sender,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true}
	)
	messages_sent!: Collection<Message>;

	@OneToMany(
		() => Message,
		message => message.receiver,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true}
	)
	messages_received!: Collection<Message>;
}
