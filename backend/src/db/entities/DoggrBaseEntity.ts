import { BaseEntity, PrimaryKey, Property } from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";

@SoftDeletable(() => DoggrBaseEntity, "deleted_at", () => new Date())
//https://mikro-orm.io/docs/defining-entities/#using-mikroorms-baseentity-previously-wrappedentity
export class DoggrBaseEntity extends BaseEntity<DoggrBaseEntity, "id"> {
  @PrimaryKey()
	id!: number;
	
	@Property()
	created_at = new Date();
	
	@Property({onUpdate: () => new Date()})
	updated_at = new Date();

	@Property({ nullable: true })
	deleted_at?: Date;
}

@SoftDeletable(() => DoggrCompositeEntity, "deleted_at", () => new Date())
export class DoggrCompositeEntity {
	@Property()
	created_at = new Date();

	@Property({onUpdate: () => new Date()})
	updated_at = new Date();

	@Property({ nullable: true })
	deleted_at?: Date;
}
