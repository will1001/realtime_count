const xendit_callback = async (req, res, next) => {
    const { headers } = req
    if (headers['x-callback-token'] !== process.env.XENDIT_CALLBACK_API) {
        res.status(401).send({
            message: "Unauthorized"
        })
    }
}

module.exports = xendit_callback