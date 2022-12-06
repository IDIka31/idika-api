/**
 * @private
 */
const express = require('express');
const axios = require('axios').default;

const { makeErrorMessage, result } = require('../config/config');

/**
 *
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @param {express.NextFunction} next Express Next Function
 */

module.exports = (req, res, next) => {
    const query = req.query;

    const error = makeErrorMessage(query, ['userid'], ['Query "userid" is required!']);
    if (error.length > 0) return res.status(400).json(result({ error: true, errorMessage: error }, {}));

    axios
        .post('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
            productId: 17,
            itemId: 82,
            catalogId: 138,
            paymentId: 822,
            gameId: query.userid,
            product_ref: 'REG',
            product_ref_denom: 'REG',
        })
        .then((results) => {
            const data = {
                gameid: query.gameid,
                username: results.data.data.userNameGame,
                userid: results.data.data.gameId,
            };
            return res.status(200).json(result({}, data));
        })
        .catch(() => {
            return res.status(200).json(result({ error: true, errorMessage: [`No data found using userid: "${query.userid}"`] }, {}));
        });
};
