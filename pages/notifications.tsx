import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext'

interface Notification {
  id: string
  message: string
  createdAt: Date
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const q = query(
          collection(db, 'notifications'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const notifs: Notification[] = []
        querySnapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() } as Notification)
        })
        setNotifications(notifs)
      }
    }

    fetchNotifications()
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>Notifications - LoanEase</title>
        <meta name="description" content="View your LoanEase notifications" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle>{notification.read ? 'Read' : 'Unread'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                {notification.createdAt.toDate().toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

