import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    bg: 'linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box',
    border: '1px solid transparent',
    borderRadius: '30px',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    p: '2',
    boxShadow: 'lg',
  },
  header: {
    width: '100%'
  },
  body: {
    border: '1px solid transparent',
    borderRadius: '30px',
  },
  footer: {
    width: '100%'
  },
})

export const cardTheme = defineMultiStyleConfig({ baseStyle })