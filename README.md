# Responsive Traditional Family Tree — v7

This version fixes the layout model used in v6.

## Main changes
- No fixed-position person cards.
- No nested horizontal scrolling tree.
- Desktop uses a traditional family-tree layout with dynamically drawn connector lines based on the actual browser layout.
- Mobile switches to a vertical family hierarchy using the normal page scroll.
- Every person card is clickable.
- Clicking a person offers:
  - Add/correct information
  - Add a child
  - Add spouse / partner
  - Add a sibling
  - Add a parent
  - Send a photo / document
- The selected person and relationship are prefilled in the email submission form.
- A separate “Add a missing family member” button is provided.
- Email destination: agurenbalkov@gmail.com
- Birth/death dates display directly on cards whenever they are known.

## Current known date/status
- Fatma Akgül: born 1954
- Isa (Atidje's brother): deceased, exact dates still unknown

## Adding photos later
Add a `photo` field to any person in `tree-data.js`, e.g.:

`photo: "images/fatma.jpg"`

Then create an `images` folder in the repository and add the image file there.


## v7.1 formatting pass
- Cards are now sized to keep each branch from collapsing into neighboring branches.
- Descendant branches use their natural content width on desktop.
- Traditional spouse/partner connector lines are drawn between paired cards.
- At 1200px and below, the tree switches to the mobile/tablet hierarchy instead of trying to squeeze the desktop chart.
- Mobile uses the normal browser page scroll, not an internal tree scroller.
- Couple cards remain paired side-by-side when practical on small screens.


## v7.2 family addition
Aguren's immediate family is now included in both the paternal and maternal views:
- Courtney Witherspoon-Balkov — wife
- Athen Balkov — son

Aguren and Courtney are shown as a couple with Athen connected beneath them.


## v7.3 expanding-tree layout
- The large white family-tree box now grows to the actual width of the family tree.
- Branches no longer hang outside the white container.
- Desktop cards are slightly wider and branch spacing is increased for readability.
- The page itself can grow on very wide family trees rather than squeezing or clipping the chart.
- At 1200px and below, the site still switches to the vertical mobile/tablet layout with ordinary page scrolling.


## v7.3 dynamic white-panel sizing
The desktop tree now measures the actual rendered family structure after every render and browser resize.
The white tree panel expands around the widest family branch instead of letting cards hang outside it.
Tree height remains content-driven, so adding children/grandchildren also increases the panel height automatically.


## v7.4 dedicated phone layout
Desktop and phone now use two separate presentations of the same family data.

Desktop:
- traditional genealogy chart
- spouse connectors and parent/child lines
- expanding white tree panel

Phone/tablet:
- no horizontal tree canvas
- no sideways scrolling
- normal page scrolling only
- couples stay visually paired
- descendants are nested underneath with simple branch lines
- larger tap targets
- every person opens the same add/correct/relative/photo actions

The underlying family data remains in `tree-data.js`, so edits update both desktop and mobile views automatically.
