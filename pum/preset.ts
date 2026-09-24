import { definePreset } from '@pandacss/dev'
import { pumTheme } from './theme'

import { collapseRecipe , collapseTitleRecipe } from 'panda-ui-mithril/recipes'
import { alertRecipe } from 'panda-ui-mithril/recipes'
import { auraRecipe } from 'panda-ui-mithril/recipes'
import { avatarRecipe } from 'panda-ui-mithril/recipes'
import { badgeRecipe } from 'panda-ui-mithril/recipes'
import { blockRecipe } from 'panda-ui-mithril/recipes'
import { boxRecipe } from 'panda-ui-mithril/recipes'
import { breadcrumbsRecipe } from 'panda-ui-mithril/recipes'
import { buttonRecipe } from 'panda-ui-mithril/recipes'
import { buttonGroupRecipe } from 'panda-ui-mithril/recipes'
import { calendarRecipe } from 'panda-ui-mithril/recipes'
import { cardRecipe } from 'panda-ui-mithril/recipes'
import { carouselRecipe , carouselItemRecipe } from 'panda-ui-mithril/recipes'
import { chatBubbleRecipe } from 'panda-ui-mithril/recipes'
import { checkboxRecipe } from 'panda-ui-mithril/recipes'
import { colorPickerRecipe } from 'panda-ui-mithril/recipes'
import { columnsRecipe } from 'panda-ui-mithril/recipes'
import { containerRecipe } from 'panda-ui-mithril/recipes'
import { countdownDigitRecipe, countdownRecipe } from 'panda-ui-mithril/recipes'
import { diffRecipe } from 'panda-ui-mithril/recipes'
import { dividerRecipe } from 'panda-ui-mithril/recipes'
import { drawerRecipe , drawerCloseButtonRecipe } from 'panda-ui-mithril/recipes'
import { dropdownRecipe } from 'panda-ui-mithril/recipes'
import { fabRecipe , fabLabelRecipe } from 'panda-ui-mithril/recipes'
import { fieldsetRecipe , fieldsetLegendRecipe } from 'panda-ui-mithril/recipes'
import { fileInputRecipe } from 'panda-ui-mithril/recipes'
import { filterRecipe } from 'panda-ui-mithril/recipes'
import { footerRecipe } from 'panda-ui-mithril/recipes'
import { gridRecipe } from 'panda-ui-mithril/recipes'
import { heroRecipe } from 'panda-ui-mithril/recipes'
import { indicatorRecipe ,  indicatorItemRecipe } from 'panda-ui-mithril/recipes'
import { joinRecipe , joinItemRecipe } from 'panda-ui-mithril/recipes'
import { kbdRecipe } from 'panda-ui-mithril/recipes'
import { labelRecipe } from 'panda-ui-mithril/recipes'
import { linkRecipe } from 'panda-ui-mithril/recipes'
import { listRecipe } from 'panda-ui-mithril/recipes'
import { loadingRecipe } from 'panda-ui-mithril/recipes'
import { maskRecipe } from 'panda-ui-mithril/recipes'
import { megamenuRecipe } from 'panda-ui-mithril/recipes'
import { menuRecipe } from 'panda-ui-mithril/recipes'
import { modalRecipe , modalCloseButtonRecipe } from 'panda-ui-mithril/recipes'
import { navbarRecipe } from 'panda-ui-mithril/recipes'
import { otpRecipe } from 'panda-ui-mithril/recipes'
import { paginationRecipe } from 'panda-ui-mithril/recipes'
import { progressRecipe } from 'panda-ui-mithril/recipes'
import { radialProgressRecipe } from 'panda-ui-mithril/recipes'
import { radioRecipe } from 'panda-ui-mithril/recipes'
import { rangeRecipe } from 'panda-ui-mithril/recipes'
import { ratingRecipe } from 'panda-ui-mithril/recipes'
import { ratingGroupRecipe , ratingGroupLabelRecipe } from 'panda-ui-mithril/recipes'
import { selectRecipe } from 'panda-ui-mithril/recipes'
import { skeletonRecipe } from 'panda-ui-mithril/recipes'
import { stackRecipe } from 'panda-ui-mithril/recipes'
import { statRecipe } from 'panda-ui-mithril/recipes'
import { statusRecipe } from 'panda-ui-mithril/recipes'
import { stepsRecipe } from 'panda-ui-mithril/recipes'
import { swapRecipe } from 'panda-ui-mithril/recipes'
import { tableRecipe , tableOverflowRecipe } from 'panda-ui-mithril/recipes'
import { tabsRecipe } from 'panda-ui-mithril/recipes'
import { tagRecipe } from 'panda-ui-mithril/recipes'
import { textRecipe } from 'panda-ui-mithril/recipes'
import { textareaRecipe } from 'panda-ui-mithril/recipes'
import { textInputRecipe } from 'panda-ui-mithril/recipes'
import { timelineRecipe } from 'panda-ui-mithril/recipes'
import { titleRecipe } from 'panda-ui-mithril/recipes'
import { toastRecipe } from 'panda-ui-mithril/recipes'
import { toggleRecipe } from 'panda-ui-mithril/recipes'
import { tooltipRecipe } from 'panda-ui-mithril/recipes'

export const pumPreset = definePreset({
  name: 'panda-ui-mithril',
  conditions: {
    dark: '&:is([data-theme="dark"], [data-theme="dark"] *)',
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
  },
  theme: {
    slotRecipes :{
        avatar : avatarRecipe ,
        card : cardRecipe ,
        calendar : calendarRecipe ,
        ChatBubblePUM : chatBubbleRecipe ,
        columns : columnsRecipe ,
        diff : diffRecipe ,
        drawer : drawerRecipe ,
        footer : footerRecipe ,
        gridPUM : gridRecipe ,
        hero : heroRecipe ,
        list : listRecipe ,
        megamenu : megamenuRecipe ,
        modal : modalRecipe ,
        navbar : navbarRecipe ,
        rating : ratingRecipe ,
        steps : stepsRecipe , 
        table : tableRecipe ,   
        timeline : timelineRecipe  ,
        stat : statRecipe,
      },
      recipes : {        
        collapse : collapseRecipe,
        collapseTitle : collapseTitleRecipe,
        alert : alertRecipe,
        aura : auraRecipe,
        badge : badgeRecipe,
        block : blockRecipe,
        /*box:boxRecipe*/
        breadcrumbs : breadcrumbsRecipe,
        button : buttonRecipe,
        buttonGroup : buttonGroupRecipe,        
        carousel : carouselRecipe,
        carouselItem : carouselItemRecipe,
        checkbox : checkboxRecipe,
        colorPicker : colorPickerRecipe,
        containerPUM : containerRecipe,
        countdown : countdownRecipe,
        countdownDigit : countdownDigitRecipe,
        dividerPUM : dividerRecipe,
        drawerCloseButton : drawerCloseButtonRecipe,
        fab : fabRecipe,
        fabLabel : fabLabelRecipe,
        fieldset : fieldsetRecipe,
        fieldsetLegend : fieldsetLegendRecipe,
        fileInput : fileInputRecipe,
        filter: filterRecipe ,
        indicator : indicatorRecipe ,
        indicatorItem : indicatorItemRecipe ,
        join : joinRecipe ,
        joinItem : joinItemRecipe,
        kbd : kbdRecipe,
        label : labelRecipe,
        link : linkRecipe ,        
        loading : loadingRecipe ,
        mask : maskRecipe ,        
        dropdown : dropdownRecipe ,
        menu : menuRecipe ,        
        otp : otpRecipe ,
        pagination : paginationRecipe ,
        progress : progressRecipe ,
        radialProgress : radialProgressRecipe ,
        radio : radioRecipe ,
        range : rangeRecipe ,
        ratingGroup : ratingGroupRecipe, 
        ratingGroupLabel : ratingGroupLabelRecipe ,
        select : selectRecipe ,
        skeleton : skeletonRecipe ,        
        status : statusRecipe ,
        stackPUM : stackRecipe ,
        tag : tagRecipe ,
        text : textRecipe ,
        textarea : textareaRecipe , 
        textInput : textInputRecipe ,
        title : titleRecipe ,
        toast : toastRecipe ,
        toggle : toggleRecipe ,
        tooltip : tooltipRecipe ,

        modalCloseButton : modalCloseButtonRecipe,
        boxPUM : boxRecipe ,
        swap : swapRecipe,
        tableOverflow : tableOverflowRecipe,
        tabs : tabsRecipe,
    },
    extend: { ...pumTheme },
  },
  globalCss: {
    ':root': {
      // La fuente base viene del token fonts.sans (no hardcodeada): así el
      // editor de fuentes (config-ui) y los consumidores pueden cambiar la
      // tipografía del proyecto vía pum/theme/fonts.ts y se aplica de verdad.
      fontFamily: 'var(--fonts-sans)',
      '--size-field': '.25rem',
      '--size': 'calc(var(--size-field,.25rem) * 10)',
      /* Border-radius tokens (light theme defaults) */
      '--radius-selector': '0.5rem',
      '--radius-field': '0.25rem',
      '--radius-box': '0.5rem',
      '--border':'1px',
      '--fontsize': '.875rem',
      '--depth': '1',
      '--noise': '0',
      '--fx-noise': 'none',
    },
    body: {
      scrollbarGutter: 'stable',
    },
    'body:has(dialog[open])': {
      overflow: 'hidden',
    },
  },
  // lets the browser smoothly animate the conic-gradient angle instead of
  // snapping to it every keyframe (plain custom properties can't tween)
  globalVars: {
    '--aura-angle': {
      syntax: '<angle>',
      inherits: false,
      initialValue: '0deg',
    },
  },
})
