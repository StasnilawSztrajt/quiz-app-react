import React from 'react'
import {shallow} from 'enzyme'
import Answers from './Answers'
import {expect} from 'chai'

describe('<Answers />', () => {
  it('renders text', () =>{
    const wrapper = shallow(<Answers id={'lorem ipsum'} answer={{answer: 'lorem ipsum', correctness: 'text-gray-500'}}/>)
    expect(wrapper.find('button')).to.contain({answer: 'lorem ipsum', correctness: 'text-gray-500'})
  })
});

