# Changelog

## 1.0.0 (2021-02-15)


### ⚠ BREAKING CHANGES

* top content & top editions reports have a expandable breakdown row (#48)

### Features

* breakdown widget ([#22](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/22)) ([7bf2b47](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/7bf2b47a9f52850c41abee251dc1dfdfcee94230))
* **date range:** setting default date range to be last 7 days ([#23](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/23)) ([3564656](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/3564656fd34b15a5f4111c1b4f96e945f92ae482))
* deep links for content items ([#20](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/20)) ([a8a6676](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/a8a66760dc6da8df6059398f523f57b4ce6f9516))
* deep links via the sdk ([#59](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/59)) ([d7517e6](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/d7517e6390bb646af8a4811de638f65bdf5fb53e))
* **edition filter:** enabled the edition to be changed when already selected ([#42](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/42)) ([eddb510](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/eddb510d0c650dfb25aa2814afb52d9f0d6c44c1))
* **edition name:** adding deep link to edition names on the edition report ([#21](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/21)) ([cbdacb6](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/cbdacb6f0617c76defb6365754132d321a05b4d1))
* **extensions sdk:** added extensions library to fetch the config for an extension ([#6](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/6)) ([0a4b5f6](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/0a4b5f6cb93628e876fbf85f2f3b27e427f5708a))
* filter by content item ([#52](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/52)) ([dd5a64b](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/dd5a64b575c5f5e3fdc82ba8b688741f52951af5))
* filter by slots ([#53](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/53)) ([e05651a](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/e05651a5b4871d98880b23aa29971484c784a0c4))
* filter reports by edition ([#16](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/16)) ([09bcece](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/09bcece65b19d24d1ced68fb89d17dc9e67e3cb3))
* **filters:** added the ability to configure a GA filter ([#45](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/45)) ([a90d007](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/a90d0074b8d61cfc0d1ee6f96d54cf9388b3152b))
* **ga charts:** updating ga charts with improved ui ([#35](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/35)) ([1c9128c](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/1c9128c447c5eb7f5c058631b64059fbe18d6472))
* ga-data-generator tool ([#4](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/4)) ([ba92cf1](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/ba92cf1058f98c8565c1937b9388a7e28285a16d))
* **gapi auth:** service account auth ([#51](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/51)) ([ebb21ae](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/ebb21ae635cad90a2272d02472f5ea9ad8fcf056))
* **management-client:** integrate mangement sdk and extension sdk ([#9](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/9)) ([733771a](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/733771af26c8edd7e906d5fb54a9000a25962233))
* **overview:** overview chart ([#8](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/8)) ([07a4bb1](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/07a4bb19cbed97949c80a6bfde1ba82e960dd8af))
* persist the selected edition, date range and table limit store values ([#18](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/18)) ([5ded5c6](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/5ded5c6a2dcb6ba4c8d65f43aefd57ceca246594))
* **reports:** empty states ([#56](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/56)) ([e5c1864](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/e5c186421f274bc6c820c3b1d60c91ffd42ac891))
* swapped react for svelte ([#3](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/3)) ([cdbb523](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/cdbb5234c211093b2bdaf0e346bcdf4c1992fbba))
* top content & top editions reports have a expandable breakdown row ([#48](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/48)) ([54ec521](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/54ec52147da84ae84a8d5aa8e8c6e3f48e7f91f8))
* **top content report:** adding top content report widget ([#15](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/15)) ([0908cd8](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/0908cd8708bfaded18a0b2ee444d2c5b2c56433e))
* **top editions report:** added a new report and refactored some GA loading ([#19](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/19)) ([eaee936](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/eaee936b70ca994f691632fa054edb64122d5b29))
* top slots report ([#49](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/49)) ([e624066](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/e624066283777980acedb845ea790e6c6bf1f75c))


### Bug Fixes

* cache-bust google api calls ([#38](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/38)) ([67c88e8](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/67c88e830e7f1814590680aea4fc04774e2b0e34))
* **charts:** y-axis is now outside of the chart ([#40](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/40)) ([3405d82](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/3405d82a8bd69e0bbbca414402277a0251150712))
* **chip:** added spacing back in ([#47](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/47)) ([7695c54](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/7695c54a86574b9eca7bc8df8b2949d202207578))
* column heading css ([#24](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/24)) ([fc9b450](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/fc9b450c9e161277761910a1c18ed4d652aabe9e))
* **dashboard tweaks:** further changes to the dashboard ux ([#60](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/60)) ([15909cb](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/15909cb165156f474cd22fa2de0729dbf6e6573f))
* **date chips:** updated the date chips background color to fill the whole chip ([#41](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/41)) ([85a6aa0](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/85a6aa025b6d06196b57bd898847009fb1ad711b))
* **date picker:** adding cancel button and modifying action text ([#29](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/29)) ([2b3a7ff](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/2b3a7ffe57aee91157347cb2d4bc1e09f5b3d37f))
* **date picker:** removing the footer text ([#12](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/12)) ([af850e9](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/af850e978789e558b8677a60f4eb1c63f9a1d153))
* **date range picker:** removing native number input arrows ([#30](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/30)) ([bee9d59](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/bee9d59f4256fdaedd2a51b2694b74ca6570fb52))
* deep links should now only appear when the app is being viewed in the correct hub ([#32](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/32)) ([c6830f3](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/c6830f38402a56af1b452f0306ed7faac4af74b6))
* **edition filter chips:** changed to not wrap when the label is huge and limited select width ([#36](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/36)) ([9faaa30](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/9faaa308955e47e59c20012f11176f87cb5554d0))
* **edition filter:** updated to use a start date of 1970 to encompass all dates in the past ([#31](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/31)) ([69da612](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/69da6125760f50d0ee562ae04b95d107e52de7b5))
* **edition filter:** updated to use todays date instead of yesterday when no edition active end date ([#27](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/27)) ([f518381](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/f51838190f37addb88923dbd3543845a060f04ad))
* **edition picker:** set the max to 20 - env var ([#50](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/50)) ([c7f075c](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/c7f075c6b183d8f4813749549d1e8c135be9f8c8))
* **edition picker:** updated styles to reduce the height on the ripple ([#33](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/33)) ([28cbc89](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/28cbc8984c2c1efbf237f42c1b0cc32230f466eb))
* **filter by:** various style changes ([#55](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/55)) ([76603f7](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/76603f7298e5762aeb5dedcf30557afa69c3ebbc))
* **filter-icon:** added the background back ([c26d146](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/c26d1466e19a8987c6c5e7530537586192c47896))
* **filters:** ux feedback ([#57](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/57)) ([c23487a](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/c23487abae736126f2208b8acefe84ec41475f79))
* **ga config:** updated to be consistent and expect ga: to be prepended to fields in the config ([#44](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/44)) ([5c7087a](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/5c7087a9bca422352fcee57f7df98740bd09be4e))
* gapi exponential retry  ([#46](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/46)) ([72daf81](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/72daf81145e94481d3a89fb115e8b7f53271edde))
* **loading state:** changed the zindex of the graph loader to not be above the menus ([#37](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/37)) ([2548287](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/254828784d30ee7710c41c45d743d11eed7657e4))
* **persisted writable:** changed from using localstorage to use sessionstorage ([#25](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/25)) ([83f3e09](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/83f3e096f81cf5326fde232a32a17ca943a91e28))
* **persisted writable:** changed the prefix to use the selected hub when storing persisted data ([#26](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/26)) ([5632131](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/56321318651a18df00f4e0293a6661adcc8470d0))
* removed the minDate limit & fixed css styling issues with the year selector ([#7](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/7)) ([b7b265c](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/b7b265c4a47580b9b1f71ca6c453695007ae644d))
* **table reports:** fixed the gapi filters parameter ([#39](https://www.github.com/amplience/dc-extension-ga-dashboard/issues/39)) ([d09c660](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/d09c6601afa47b9dd73e470e0283758b1ac94ce5))
* the edition picker was adding a ga: prefix ([bd675c7](https://www.github.com/amplience/dc-extension-ga-dashboard/commit/bd675c7dc6b1f0f8af5412fc5bfc8e54875e0e32))
