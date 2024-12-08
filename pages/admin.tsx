import { useEffect, useState } from 'react'
import Head from 'next/head'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Application {
  id: string
  name: string
  email: string
  amount: number
  purpose: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps: Application[] = []
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as Application)
      })
      setApplications(apps)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>Admin Panel - LoanEase</title>
        <meta name="description" content="Admin panel for LoanEase" />
      </Head>
      <h1 className="text-2xl font-bold mb-5">Loan Applications</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.name}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>${app.amount.toFixed(2)}</TableCell>
              <TableCell>{app.purpose}</TableCell>
              <TableCell>
                <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'destructive' : 'default'}>
                  {app.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

