import { Card, Image } from '@mantine/core'

import classes from './Header.module.css'

export default function Header() {
  return (
    <Card className={classes.card} p="xl" bdrs="xl">
      <Image src="/images/header.png" />
    </Card>
  )
}
