import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TrackOrderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Enter tracking ID" />
          <Button>Track</Button>
        </div>
      </CardContent>
    </Card>
  )
}
