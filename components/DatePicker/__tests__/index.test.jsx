import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DatePicker from '../index';
import enLocale from '../locale/en_US';


describe('DatePicker', () => {
  it('DatePicker year', () => {
    const wrapper = render(
      <DatePicker
        title="选择年份"
        placeholder="请选择年份"
        mode="year"
        value="2017"
        locale={enLocale}
        />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DatePicker month', () => {
    const wrapper = render(
      <DatePicker
        title="选择年份"
        placeholder="请选择年份"
        mode="month"
        />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DatePicker date', () => {
    const wrapper = mount(
      <DatePicker
        title="选择日期"
        placeholder="请选择日期"
        mode="date"
        value="2009-03-04"
        />
    );
    wrapper.setProps({ value: '2017-09-06' });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DatePicker time', () => {
    const wrapper = mount(
      <DatePicker
        title="选择时间"
        placeholder="请选择时间"
        mode="time"
        defaultValue="2017-11-03 15:00"
        minuteStep={15}
        />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DatePicker datetime', () => {
    const wrapper = mount(
      <DatePicker
        title="选择时间"
        placeholder="请选择时间"
        mode="datetime"
        min="2017-11-02 11:00"
        max="2017-11-12 14:00"
        defaultValue="2017-11-03 15:00"
        />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ value: '2017-11-06 12:00' });
  });

  it('should trigger onOk when press ok button', () => {
    const onOkFn = jest.fn();
    const onCancelFn = jest.fn();

    const wrapper = mount(
      <DatePicker
        title="选择时间"
        placeholder="请选择时间"
        mode="datetime"
        defaultValue="2017-11-12 20:00"
        onOk={onOkFn}
        onCancel={onCancelFn}
        onMaskClick={onCancelFn}
        />
    );

    wrapper.find('.za-picker-submit').simulate('click');
    expect(onOkFn).toBeCalled();
    expect(onCancelFn).not.toBeCalled();
  });

  it('should trigger onCancel when press cancel button', () => {
    const onOkFn = jest.fn();
    const onCancelFn = jest.fn();

    const wrapper = mount(
      <DatePicker
        title="选择时间"
        placeholder="请选择时间"
        mode="datetime"
        onOk={onOkFn}
        onCancel={onCancelFn}
        onMaskClick={onCancelFn}
        defaultValue="2017-11-12 20:00"
        />
    );

    wrapper.find('.za-picker-cancel').simulate('click');
    expect(onCancelFn).toBeCalled();
    expect(onOkFn).not.toBeCalled();
  });

  it('should trigger maskClick when click mask', () => {
    const onClickFn = jest.fn();
    const onMaskClick = jest.fn();
    const onCancelFn = jest.fn();
    const wrapper = mount(
      <DatePicker
        title="选择时间"
        placeholder="请选择时间"
        mode="datetime"
        onClick={onClickFn}
        onCancel={onCancelFn}
        onMaskClick={onMaskClick}
        defaultValue="2017-11-12 20:00"
        />
    );
    wrapper.find('.za-picker').simulate('click');
    expect(onClickFn).toBeCalled();
    wrapper.find('.za-mask').simulate('click');
    expect(onMaskClick).toBeCalled();
    expect(onCancelFn).toBeCalled();
  });
});
