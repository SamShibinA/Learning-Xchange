// /**
//  * @typedef {'tutor' | 'learner'} UserRole
//  */

// /**
//  * @typedef {Object} UserData
//  * @property {string} id
//  * @property {string} email
//  * @property {string} name
//  * @property {UserRole} role
//  * @property {string} [avatar]
//  * @property {boolean} profileComplete
//  * @property {string[]} [skills]
//  * @property {string} [bio]
//  * @property {number} [hourlyRate]
//  * @property {number} [rating]
//  * @property {number} [totalRatings]
//  * @property {boolean} [canCharge]
//  * @property {string[]} [interests]
//  * @property {number} [sessionsAttended]
//  */

// /**
//  * @typedef {Object} ChatMessage
//  * @property {string} id
//  * @property {string} userId
//  * @property {string} userName
//  * @property {string} message
//  * @property {Date} timestamp
//  */

// /**
//  * @typedef {'scheduled' | 'live' | 'completed' | 'cancelled'} SessionStatus
//  */

// /**
//  * @typedef {Object} Session
//  * @property {string} id
//  * @property {string} title
//  * @property {string} description
//  * @property {string} tutorId
//  * @property {string} tutorName
//  * @property {string} [tutorAvatar]
//  * @property {string} skill
//  * @property {Date} scheduledFor
//  * @property {number} duration
//  * @property {number} maxLearners
//  * @property {string[]} enrolledLearners
//  * @property {SessionStatus} status
//  * @property {number} price
//  * @property {boolean} [isLive]
//  * @property {ChatMessage[]} [chatMessages]
//  */

// /**
//  * @typedef {Object} Rating
//  * @property {string} id
//  * @property {string} sessionId
//  * @property {string} tutorId
//  * @property {string} learnerId
//  * @property {number} rating
//  * @property {string} [comment]
//  * @property {Date} createdAt
//  */
