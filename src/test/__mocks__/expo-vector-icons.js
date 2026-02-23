const React = require('react');
const { Text } = require('react-native');

const IconComponent = props =>
  React.createElement(Text, props, props.name || '');

module.exports = {
  __esModule: true,
  default: IconComponent,
  FontAwesome: IconComponent,
  FontAwesome6: IconComponent,
  Ionicons: IconComponent,
  MaterialCommunityIcons: IconComponent,
  MaterialIcons: IconComponent,
};
