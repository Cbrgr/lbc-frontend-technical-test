const path = require('path')
const db = require(`${path.dirname(__filename)}/../db.json`)

module.exports = (req, res, next) => {
	if (/messages/.test(req.url) && req.method === 'GET') {
		const convId = req.query?.convId
		const result = db?.conversations?.filter(
			conv => conv.conversationId == convId
		)

		res.status(200).json(result)
		return
	}

	next()
}