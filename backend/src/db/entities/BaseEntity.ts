import { PrimaryKey, Property } from "@mikro-orm/core";

export class BaseEntity {
  @PrimaryKey()
	id!: number;
	
	@Property()
	created_at = new Date();
	
	@Property({onUpdate: () => new Date()})
	updated_at = new Date();
}
