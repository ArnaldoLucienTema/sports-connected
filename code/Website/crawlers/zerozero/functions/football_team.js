const zerozero = require('../crawler');
const proxyHandler = require('../proxy_handler');
const logger = require('../../../logging');
const baseUris = require('../base_uris');
var format = require("string-template");
const footballTeam = require('../../../models/football_team');
const footballMatchCrawler = require('../functions/football_match');
const footballCompetition = require('../../../models/football_competition');
const footballUserInfoCrawler = require('../functions/football_user_info');

const updateTeamInfo = function (err, res, done){

    const team = {
        acronym: '',
        avatar: '',
        name: '',
        full_name: '',
        external_ids: {
            zerozero: res.options.zerozeroId
        }
    };

    team.acronym = res.$("#page_header .factsheet .name").html() ?
        res.$("#page_header .factsheet .name").html():
        '';

    team.avatar = res.$("#page_header .logo img").attr("src") ?
        'https://www.zerozero.pt/' + res.$("#page_header .logo img").attr("src") :
        '';

    team.name = res.$("#page_header .factsheet .name").html() ?
        res.$("#page_header .factsheet .name").html():
        '';

    team.fullName = res.$("#entity_bio .bio")[0] ?
        res.$("#entity_bio .bio")[0].children[1].data:
        '';

    logger.info("Team Info:", team);

    const query = {"external_ids.zerozero": res.options.zerozeroId};

    footballTeam.findOneAndUpdate(query, team, { upsert:true, new:true, setDefaultsOnInsert: true }, function (err, result) {
        if (err) {
            logger.error(err);
            done();
        }
        else {
            logger.info("Successfully updated team " + res._doc);

            res.options.teamId = result._doc._id;

            if(res.options.competition){

                //Add competition to team

                let query = {
                    "external_ids.zerozero": res.options.zerozeroId,
                    "current_season.standings.id": { $ne: res.options.competition._id }
                };

                let update = {
                    $addToSet: { "current_season.standings": {
                            id: res.options.competition._id,
                            name: res.options.competition.name,
                            avatar: res.options.competition.avatar,
                        }
                    }
                };

                footballTeam.findOneAndUpdate(query, update, { upsert:true, new:true, setDefaultsOnInsert: true },  function (err, result) {
                    if (err) {
                        logger.error("Error when adding competition to team:", err);
                    }
                    else {
                        logger.info("Successfully added competition " + res.options.competition.name + "to team " + result._doc.name);
                    }
                });

                //Add team to competition

                query = {
                    "_id": res.options.competition._id,
                    "current_season.standings.id": { $ne: result._doc._id }
                };

                update = {
                    $addToSet: { "current_season.standings": {
                            id: result._doc._id,
                            name: result._doc.name,
                            avatar: result._doc.avatar,
                        }
                    }
                }

                footballCompetition.findOneAndUpdate(query, update, { upsert:true, new:true, setDefaultsOnInsert: true }, function (err, result) {
                    if (err) {
                        logger.error("Error when adding team to competition:", err);
                    }
                    else {
                        logger.info("Successfully added team " + result._doc.name + " to competition " + res.options.competition.name);
                    }
                });
            }

            processAllTeamPlayers(err, res, done);
        }
    });
};


const processAllTeamPlayers = function (err, res, done){
    let playerIds = [];

    res.$("#team_squad .staff .name .micrologo_and_text .text a").each(function() {
        let playerId = res.$(this).attr('href').match(/\d+/g)[0]

        zerozero.queue({
            uri:format(baseUris.PLAYER_INFO, { player_id: playerId }),
            callback: proxyHandler.crawl,
            successCallback: footballUserInfoCrawler.updateUserInfo,
            proxyFailCallback: zerozero.proxyFailCallback,
            zerozeroId: playerId,
            teamId: res.options.teamId
        });

        playerIds.push(playerId);
    });

    logger.info("Team Player IDs in processing: " + playerIds);

    done();

}

//not used, may be useful in the future...
const processAllTeamGames = function (err, res, done){
    let matchIds = [];

    res.$("#team_games table tr .result a").each(function() {
        let matchId = res.$(this).attr('href').match(/\d+/g)[0]

        zerozero.queue({
            uri:format(baseUris.MATCH_INFO, { match_id: matchId }),
            callback: proxyHandler.crawl,
            successCallback: footballMatchCrawler.processMatchInfo,
            zerozeroId: matchId
        });

        matchIds.push(matchId);
    });

    logger.info("Team Matches IDs in processing: " + gameIds);

    done();
};

module.exports = {
    updateTeamInfo: updateTeamInfo,
    processAllTeamGames: processAllTeamGames,
    processAllTeamPlayers: processAllTeamPlayers
}
