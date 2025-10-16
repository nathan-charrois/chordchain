import { Card, Image } from '@mantine/core'

import classes from './Header.module.css'

export default function Header() {
  return (
    <Card
      className={classes.card}
      m="xl"
      p="xl"
      bdrs="xl"
      w={500}
    >
      <Image alt="ChordChain" src="/images/header.png" aria-label="ChordChain Logo" />
    </Card>
  )
}
