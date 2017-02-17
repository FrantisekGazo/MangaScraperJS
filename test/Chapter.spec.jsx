"use strict";

const expect = require('expect');
const shallow = require('enzyme').shallow;
const React = require('react');

const Chapter = require('../src/ui/components/Manga/ChapterListItem.jsx');


describe('component', () => {

    it('should render text', () => {
        let chapter = {title: 'Test Chapter 1', date: 'Some date'};
        const component = shallow(<Chapter chapter={chapter} onClick={() => {}} />);
        expect(component.text()).toInclude('Test Chapter 1');
    });
});
