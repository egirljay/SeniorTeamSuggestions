const { Schema, model } = require('mongoose');

module.exports = model("blacklist", new Schema(
        {
            _id: String, // Suggestion ID
            suggestion: String, // Suggestion
            userId: String, // User ID
            guildId: String, // Guild ID
            status: String, // Status [pending, approved, denied, implemented]
            messageId: String, // Message ID
        }
    )
);