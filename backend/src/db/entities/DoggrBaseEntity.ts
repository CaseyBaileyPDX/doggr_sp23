import { BaseEntity, PrimaryKey, Property } from "@mikro-orm/core";

//https://mikro-orm.io/docs/defining-entities/#using-mikroorms-baseentity-previously-wrappedentity
export class DoggrBaseEntity extends BaseEntity<DoggrBaseEntity, "id"> {
  @PrimaryKey()
	id!: number;
	
	@Property()
	created_at = new Date();
	
	@Property({onUpdate: () => new Date()})
	updated_at = new Date();
}
