import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ children }) => <div>{children}</div>;

/**
 * Part of dcc.Tabs - this is the child Tab component used to render a tabbed page.
 * Its children will be set as the content of that tab, which if clicked will become visible.
 */
Tab.propTypes = {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * The tab's label
   */
  label: PropTypes.string,

  /**
   * The content of the tab - will only be displayed if this tab is selected
   */
  children: PropTypes.node,

  /**
   * Value for determining which Tab is currently selected
   */
  value: PropTypes.string,

  /**
   * Appends a class to the Tab component.
   */
  className: PropTypes.string,

  /**
   * Appends a class to the Tab component when it is selected.
   */
  selected_className: PropTypes.string,

  /**
   * Overrides the default (inline) styles for the Tab component.
   */
  style: PropTypes.object,

  /**
   * Overrides the default (inline) styles for the Tab component when it is selected.
   */
  selected_style: PropTypes.object
};

export default Tab;
