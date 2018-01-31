#!/bin/bash

echo "My script is running."

declare -a arr=(
'row'
'column'
'textBlock'
'singleImage'
'basicButton'
'basicButtonIcon'
'featureSection'
'flickrImage'
'flipBox'
'messageBox'
'googleFontsHeading'
'googleMaps'
'googlePlusButton'
'heroSection'
'icon'
'imageGallery'
'imageMasonryGallery'
'instagramImage'
'outlineButton'
'outlineButtonIcon'
'pinterestPinit'
'rawHtml'
'facebookLike'
'feature'
'rawJs'
'separator'
'doubleSeparator'
'separatorIcon'
'separatorTitle'
'shortcode'
'section'
'twitterButton'
'twitterGrid'
'twitterTimeline'
'twitterTweet'
'vimeoPlayer'
'wpWidgetsCustom'
'wpWidgetsDefault'
'youtubePlayer'
'faqToggle'
'postsGridItemPostDescription'
'postsGridDataSourcePost'
'postsGridDataSourcePage'
'postsGridDataSourceCustomPostType'
'postsGridDataSourceListOfIds'
'postsGrid'
'woocommerceTopRatedProducts'
'woocommerceSaleProducts'
'woocommerceRelatedProducts'
'woocommerceRecentProducts'
'woocommerceProducts'
'woocommerceProductPage'
'woocommerceProductCategory'
'woocommerceProductCategories'
'woocommerceProductAttribute'
'woocommerceProduct'
'woocommerceOrderTracking'
'woocommerceMyAccount'
'woocommerceFeaturedProducts'
'woocommerceCheckout'
'woocommerceCart'
'woocommerceBestSellingProducts'
'woocommerceAddToCart'
'tab'
'tabsWithSlide'
'simpleImageSlider'
'featureDescription'
'pricingTable'
'transparentOutlineButton'
'outlineShadowButton'
'underlineButton'
'parallelogramButton'
'resizeButton'
'borderHoverButton'
'3dButton'
'strikethroughOutlineButton'
'simpleGradientButton'
'quoteButton'
'strikethroughButton'
'filledShadowButton'
'animatedShadowButton'
'symmetricButton'
'zigZagButton'
'smoothShadowButton'
'halfOutlineButton'
'gatsbyButton'
'animatedOutlineButton'
'animatedIconButton'
'animatedTwoColorButton'
'callToAction'
'emptySpace'
'outlineMessageBox'
'widgetizedSidebar'
'flickrWidget'
'copyright'
'logoWidget'
'basicMenu'
'outlinePricingTable'
'classicTab'
'classicTabs'
'hoverBox'
'iconHoverBox'
'tallHoverBox'
'separatedButton'
'sandwichMenu'
'sidebarMenu'
'classicAccordion'
'classicAccordionSection'
'testimonial'
'pageableContainer'
'pageableTab'
'contactForm7'
'featuredImagePostGrid'
'featuredImagePostGridItem'
'syntaxHighlighter'
'multipleImageCollage'
'typewriterHeading'
'centeredPostGrid'
'centeredPostGridItem'
'videoPlayer'
'logoSlider'
'facebookShare'
'facebookSave'
)

EXECDIR=`pwd`

for i in "${arr[@]}"
do
   if cd $EXECDIR/devElements/$i; then cd $EXECDIR/devElements/$i && git pull; else git clone git@gitlab.com:visualcomposer-hub/$i.git $EXECDIR/devElements/$i; fi
done

echo "Done!"