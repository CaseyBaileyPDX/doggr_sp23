import { Entity, Property, Unique, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { Match } from "./Match.js";

@Entity({ tableName: "users" })
export class User extends BaseEntity {
	@Property()
	@Unique()
	email!: string;

	@Property()
	name!: string;

	@Property()
	petType!: string;

	// Note that these DO NOT EXIST in the database itself!
	@OneToMany(() => Match, (match) => match.owner, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	matches!: Collection<Match>;

	@OneToMany(() => Match, (match) => match.matchee, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
	matched_by!: Collection<Match>;

  /* HW 1 NOTE!  We do NOT add Messages here!  This is the reason
   some of you needed Rel<> in your submission.  I gave an
   exhaustive explanation in Discord here:
   https://discord.com/channels/1092372291112931330/1092372291670786110/1103471051926667384
  */
}
