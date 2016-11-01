"use strict";

const expect = require('expect');
const shallow = require('enzyme').shallow;
const React = require('react');

const Counter = require('../src/ui/components/Counter.jsx');

let props = {counter: 42};

describe('component', () => {

    it('should render text', () => {
        const component = shallow(<Counter {...props} />);
        expect(component.text()).toInclude('42');
    });
});
