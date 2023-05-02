export type ICreateUsersBody = {
	name: string,
	email: string,
	petType: string
}

export type ICreateMessage = {
	sender: string,
	receiver: string,
	message: string,
}
