import { Entity, ManyToOne} from "@mikro-orm/core";
import type {Ref} from "@mikro-orm/core";
import { DoggrCompositeEntity } from "./DoggrBaseEntity.js";
import { User } from "./User.js";

@Entity()
export class Pass extends DoggrCompositeEntity {
	@ManyToOne({primary: true})
	owner!: Ref<User>

	@ManyToOne({primary: true})
	passee!: Ref<User>

}
