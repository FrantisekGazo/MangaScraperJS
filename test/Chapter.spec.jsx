"use strict";

const expect = require('expect');
const shallow = require('enzyme').shallow;
const React = require('react');

const Chapter = require('../src/ui/components/Chapter.jsx');

let props = {title: 'Test Chapter 1'};

describe('component', () => {

    it('should render text', () => {
        const component = shallow(<Chapter title={props.title} />);
        expect(component.text()).toInclude('Test Chapter 1');
    });
});
