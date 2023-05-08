export type ICreateUsersBody = {
	name: string,
	email: string,
	password: string,
	petType: string
}

export type IUpdateUsersBody = {
	name: string,
	id: number,
	petType: string
}

export type ICreateMessage = {
	sender_id: number,
	receiver_id: number,
	message: string,
}
