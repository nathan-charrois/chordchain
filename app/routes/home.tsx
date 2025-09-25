import type { MetaArgs } from 'react-router'

import { Button } from '@/components/ui/8bit/button'
import { Card, CardContent } from '@/components/ui/8bit/card'

export function meta({}: MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <Card>
      <CardContent>
        <Button variant="outline">Button</Button>
      </CardContent>
    </Card>
  )
}
