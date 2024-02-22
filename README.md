# AngularStarterpack

This is an Angular Boilerplate that can be used to kickstart the development on any Angular project with speed. In the 4 years of working in a service industry, we have built numerous projects and accumulated a lot of learnings from them, that are baked into this boilerplate. Over time, we also noticed certain similarities that repeat themselves in all the projects. We did not necessarily have to re-invent the wheel everytime a new project was started. This boilerplate was all that we would need to get to writing the business logic of the project, the stuff that truly mattered. Using this boilerplate as the base for a project would also force devs to adopt a certian standard set by the boilerplate, thereby ensuring everyone is writing efficient, abstarcted and highly readable code!

In order to set this up:
1 => Change the name of this app from angular-starterpack to whatever you wish to keep.
2 => Have a env folder in your root directory with staging.env and prod.env files in it.
3 => Use your configs whereever there is "YOUR-" prefix.
3 => Run npm install
4 => For staging: npm run start:staging, For prod: npm run start:prod

The boilerplate has/will have the following- 

## Components

1. Linear loader
2. Spinner
3. Pseudo cards (In Progress)
4. Avatar (In Progress)
5. Success/Error Toast Messages (In Progress)
6. Action Buttons (In Progress)
7. Action Modals (In Progress)
8. Error Modals (In Progress)
9. Confirmations Modals

## Directives

1. Limit-to 
2. Search Input 
3. Lazy load images directive 
4. Infinite Scroll 

## Pipes

1. safeHTML
2. moment parser 
3. join 
4. duration 
5. titlelize 

## Services

1. Authentication (basic scaffolding) (In Progress)
2. User Service (basic scaffolding)
3. Apollo Service
4. Error Service
5. Constants service
6. Validators (In Progress)

## Style components

1. Icon pack (In Progress)
2. Fonts & typography (In Progress)
3. Navbar (In Progress)
4. Animations/Micro interactions (In Progress)
5. Layouts (In Progress)
    1. Grids
    2. Cards
    3. Panels

## Modular Functions

1. DeepCopy 
2. makeDateTime 
3. isObjectEmpty
4. isMobile 
5. getRelativeTime

## Packages
1. @agm/core
2. @angular/animations
3. @angular/cdk
4. @angular/common
5. @angular/compiler
6. @angular/core
7. @angular/forms
8. @angular/material 
    1. mat-dialog
        - For Add City Modal
        - For Add Cuisine Modal
        - For Edit Holiday Slot Modal
        - For Holiday Slot Action Modal
        - For Login Modal
    2. mat-form-field
        - In Add City Modal
        - In Add Cuisine Modal
        - In Edit Holiday Slot Modal
        - In Holiday Slot Action Modal
        - In Login Modal
    3. mat-icon
        - In Area Lists Component
        - In Finance Component
        - In Log data Component
        - In Side-nav Component
        - In Upload Data Component
        - In Cuisines Component
        - In Partner-Users Component
        - In Home Component
        - In Catelogue Component
        - In Finances Component
        - In Fssai Component
        - In Holiday-slots Component
        - In Menu Component
        - In Slots Component
        - In Tools Component
        - In Add New Item Modal
    4. mat-tab
        - For All Tabs in Home-tabs Component
    5. mat-expansion-panel
        - In General Component
        - In Catelogue Component
        - In Finances Component
        - In menu Component
    6. mat-radio-button
        - To select The Reason for Disabling Restaurant on Home Page
        - To select Status, Long Distance Order, Exclusive to Speedyy, Restaurant Type in Basic Information on General Page
        - To select Item Inclusive, Packing Charge Inclusive in GST on Catelogue Page
        - To select Veg, Non Veg options on Menu Page
        - To select Menu Type on Upload-Data Page
        - To include unlinked add-ons on Download-Data Page
    7. mat-checkbox
        - To select list options from list on Home Page
    8. mat-table
        - To display list in tabular format in Area List Page
        - To display list in tabular format in City Page
        - To display list in tabular format in Finance Page
        - To display list in tabular format in Log-data Page
        - To display list in tabular format in Cuisines Page
        - To display list in tabular format in Items Page
        - To display list in tabular format in Partner-users Page
        - To display list in tabular format in Home Page
        - To display list in tabular format in Holiday Slots Page
        - To display list in tabular format in Menu Page
        - To display list in tabular format in Slots Page
    9. mat-paginator
        - Pagination for Area List Page
        - Pagination for City Page
        - Pagination for Finance Page
        - Pagination for Log-data Page
        - Pagination for Cuisines Page
        - Pagination for Items Page
        - Pagination for Partner-users Page
        - Pagination for Home Page
        - Pagination for Holiday Slots Page
        - Pagination for Slots Page
    10. mat-datepicker
        - To select date in Holiday Slots Page
9. @angular/platform-browser
10. @angular/platform-browser-dynamic
11. @angular/router
12. @ng-select/ng-select
    1. To select City name in Area Page
    2. To select City Id, City, Polygon, Status for filter in Area Lists Page
    3. To select City Id, City, Status for filter in City Page
    4. To select Id, Restaurant Name, Commission , GST No. for filter in Finance Page
    5. To select Id, Type, Uploaded By, Date for filter in Log-data Page
    6. To select Id, Cuisine Name, Status for filter in Cuisines Page
    7. To select Recommended, Food Status for filter in Items Page
    8. To select Vendor Id, Desktop Applet for filter in Partner-Users Page
    9. To select City Code, Area Code, Shop Status, Type for filter in Home Page
    10. To select Cuisine on Basic Information in General Page
    11. To select Changed By, Email-Id, Status for filter in Holiday Slots Page
    12. To select Category Name for Add Sub Category Modal in Menu Page
    13. To select Type for filter in Slots Page
    14. To select Category, Sub Category, Do you want to add variants?, Veg/ Non-Veg, Do you want to add add-on to this product?, Select Add-Ons Group, Select Add-Ons in Add New Item Modal Page
13. @types/googlemaps
14. bootstrap
15. moment
    1. For Today Date, From Date, To Date in Holiday Slots TS
    2. For FSSAI Application Date, FSSAI Expiration Date in Home-Tabs TS
    3. For Time in Home TS
    4. For Opening Hours, Closing Hours in Slotys TS
16. ng-toggle
    1. In Actions for Currently Open, Enabled, Archive on Home Page
17. ng2-search-filter
18. ngx-bootstrap
19. ngx-img
    1. Add Item Photo on Add New Item Modal
20. ngx-material-timepicker
    1. To select Start Date, End Date on Holiday-slots-action-dialog
21. ngx-toastr
    1. Login Page
    2. Home Page-Actions-Currently Open
    3. Home page-Status-Toggle
    4. Home-Menu Page-Add Category
    5. Home-Menu Page-Add Subcategory
    6. Home-Menu Page-Add Item
    7. Home-Menu Page-Add Group
    8. Home-Menu Page-Add New Add On
    9. Home-Menu Page-Category, Sub Category, Item Toggle
    10. Home-Slots Page-Add Time Slots
    11. Home-Holiday Slots Page-Add Time Slots
    12. Home-Holiday Slots Page-Delete
    13. City Page-Add City
    14. City Page-Status
    15. City Page- Delete
    16. Area Page-Status
    17. Area Page-Delete
    18. Area Page-Add Slots
    19. Area Page-Save Polygon
    20. Data Dump-Cuisines Page-Add Cuisine
    21. Data Dump-Cuisines Page-Status
    22. Data Dump-Cuisines Page-Delete
    23. Logout
