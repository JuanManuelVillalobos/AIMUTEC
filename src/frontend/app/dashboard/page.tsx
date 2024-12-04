import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentList } from "@/components/document-list"
import { FileUpload } from "@/components/file-upload"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AIMUTEC</h2>
      </div>
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="upload">Subir Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Manejo de documentos</CardTitle>
                <CardDescription>
                  Ve y maneja documentos subidos, aprueba y niega.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>        
        <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subir documentos</CardTitle>
                <CardDescription>
                  Sube tus documentos aqui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  )
}

