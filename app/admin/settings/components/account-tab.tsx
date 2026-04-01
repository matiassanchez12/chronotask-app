"use client";

import Image from "next/image";
import { User, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Session } from "next-auth";

interface AccountTabProps {
  session: Session | null;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function AccountTab({ session, uploading, onUpload, fileInputRef }: AccountTabProps) {
  return (
    <section className="space-y-6">
      <Card className="rounded-2xl border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Foto de perfil</CardTitle>
          <CardDescription>Tu imagen se muestra en todas las tareas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted shrink-0 ring-4 ring-border/50 shadow-lg transition-shadow group-hover:ring-foreground/20">
                {session?.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Foto de perfil"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <Upload className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
              </div>
            </div>
            
            <div className="flex-1 space-y-1">
              <p className="text-xl font-semibold">{session?.user?.name || "Usuario"}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={onUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2 rounded-xl px-4"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Subiendo..." : "Cambiar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
