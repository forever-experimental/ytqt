#!/usr/bin/env node
        
// require('dotenv').config(); // will parse EDIT_THIS_KEY= from .env at this dir level
// useage is process.env.EDIT_THIS_KEY
        
// True if ran from CLI or npm run dev and false when using require
if (require.main === module) {
    console.log("Hello from", "ytqt!");
    // Add CLI specific code here
} else {
    module.exports = {  };
}
