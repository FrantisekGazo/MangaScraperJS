"use strict";

const React = require('react');

const MangaSelector = require('../containers/MangaSelector.jsx');
const CurrentManga = require('../containers/CurrentManga.jsx');


const AppLayout = ({}) => {
    return <div>
        <MangaSelector />
        <CurrentManga />
    </div>
};

module.exports = AppLayout;
