const spacing = [2, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30];

const spacingStyles: { [key: string]: object } = {};

spacing.forEach((val) => {
  spacingStyles[`m${val}`] = { margin: val };
  spacingStyles[`mt${val}`] = { marginTop: val };
  spacingStyles[`mb${val}`] = { marginBottom: val };
  spacingStyles[`ml${val}`] = { marginLeft: val };
  spacingStyles[`mr${val}`] = { marginRight: val };
  spacingStyles[`mx${val}`] = { marginHorizontal: val };
  spacingStyles[`my${val}`] = { marginVertical: val };

  spacingStyles[`p${val}`] = { padding: val };
  spacingStyles[`pt${val}`] = { paddingTop: val };
  spacingStyles[`pb${val}`] = { paddingBottom: val };
  spacingStyles[`pl${val}`] = { paddingLeft: val };
  spacingStyles[`pr${val}`] = { paddingRight: val };
  spacingStyles[`px${val}`] = { paddingHorizontal: val };
  spacingStyles[`py${val}`] = { paddingVertical: val };
});

export default spacingStyles;
