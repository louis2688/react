/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let ReactDOM;
let ReactTestUtils;

describe('ReactEventIndependence', () => {
  beforeEach(() => {
    jest.resetModules();

    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('react-dom/test-utils');
  });

  it('does not crash with other react inside', () => {
    let clicks = 0;
    const div = ReactTestUtils.renderIntoDocument(
      <div
        onClick={() => clicks++}
        dangerouslySetInnerHTML={{
          __html: '<button data-reactid=".z">click me</div>',
        }}
      />,
    );
    ReactTestUtils.SimulateNative.click(div.firstChild);
    expect(clicks).toBe(1);
  });

  it('does not crash with other react outside', () => {
    let clicks = 0;
    const outer = document.createElement('div');
    outer.setAttribute('data-reactid', '.z');
    const inner = ReactDOM.render(
      <button onClick={() => clicks++}>click me</button>,
      outer,
    );
    ReactTestUtils.SimulateNative.click(inner);
    expect(clicks).toBe(1);
  });

  it('does not when event fired on unmounted tree', () => {
    let clicks = 0;
    const container = document.createElement('div');
    const button = ReactDOM.render(
      <button onClick={() => clicks++}>click me</button>,
      container,
    );

    // Now we unmount the component, as if caused by a non-React event handler
    // for the same click we're about to simulate, like closing a layer:
    ReactDOM.unmountComponentAtNode(container);
    ReactTestUtils.SimulateNative.click(button);

    // Since the tree is unmounted, we don't dispatch the click event.
    expect(clicks).toBe(0);
  });
});
