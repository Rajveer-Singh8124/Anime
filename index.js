const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const fs = require("fs")
const port = 200;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


function anime_title_list() {
    const fileContents = fs.readFileSync("anime_data.jsonl", "utf-8")
    const line = fileContents.split("\n")
    const anime_titles = []
    for (let index = 0; index < line.length - 1; index++) {
        const anime = JSON.parse(line[index]);
        anime_titles.push(anime["title"]);
    }
    return anime_titles
}

anime_title_list()


function findRecommendedAnimes(targetAnimeName) {
    const pt_data = fs.readFileSync("pt_data.jsonl", "utf-8");
    const pt_line = pt_data.split("\n");
    const fileContents = fs.readFileSync("anime_data.jsonl", "utf-8")
    const line = fileContents.split("\n")

    const similarityFile = fs.readFileSync("similarity_matrix.jsonl", "utf-8");
    const similarityLines = similarityFile.split("\n");

    let targetAnimeIndex = -1;
    const recommendedAnimes = [];
    // 
    targetAnimeName = targetAnimeName.trim().replace(/ +/g, ' ');

    for (let i = 0; i < pt_line.length - 1; i++) {
        const anime = JSON.parse(pt_line[i])[0];
        if (anime === targetAnimeName) {
            targetAnimeIndex = i;
            break;
        }
    }

    if (targetAnimeIndex !== -1) {
        const similarity = JSON.parse(similarityLines[targetAnimeIndex]);

        const similarityList = similarity.map((value, index) => [value, index]);
        similarityList.sort((a, b) => b[0] - a[0]);

        for (let i = 0; i < 5; i++) {
            const idx = similarityList[i][1];
            const recommendedAnime = JSON.parse(line[idx]);
            
            recommendedAnimes.push(recommendedAnime);
            console.log(recommendedAnime);
        }
    }

    return recommendedAnimes;
}

function popular_anime_fun(){
    const popular_anime_data = fs.readFileSync("popular_df.jsonl","utf-8");
    const line = popular_anime_data.split("\n");

    let popular_anime_list = []
    for(let i=0;i<line.length-1;i++){
        popular_anime_list.push(JSON.parse(line[i]))
    }
    return popular_anime_list;
}


app.get("/", ((req, res) => {
    const anime_titles = anime_title_list();
    res.render("index", { titles: anime_titles, rec: [] })
}))

app.get("/popular",((req,res)=>{
    let anime =  popular_anime_fun();
    res.render("popular",{animes:anime})
}))

app.post("/", ((req, res) => {

    const targetAnimeName = req.body.input;
    const recommendedAnimes = findRecommendedAnimes( targetAnimeName);
    const anime_titles = anime_title_list();
    res.render("index", { titles: anime_titles, rec: recommendedAnimes });

}))

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
