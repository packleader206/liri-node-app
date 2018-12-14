
// console.log("----------------");
// console.log('Keys loaded');
// console.log(process.env.SPOTIFY_ID);
// console.log(process.env.SPOTIFY_ID);
// console.log(process.env.OMDB_ID);
// console.log(process.env.BandsInTown_ID);
// console.log("----------------");

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.OMDB = {
    id: process.env.OMDB_ID
};

exports.BandsInTown = {
    id: process.env.BandsInTown_ID
};