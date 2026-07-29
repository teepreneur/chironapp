"use client"

import React from "react"
import Link from "next/link"

interface LogoProps {
  size?: number
  className?: string
  variant?: "icon" | "full" | "lockup"
  showSubtext?: boolean
  href?: string
}

export function Logo({
  size = 32,
  className = "",
  variant = "full",
  showSubtext = true,
  href,
}: LogoProps) {
  const isIcon = variant === "icon"

  const IconComponent = (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="112" fill="#0B6E4F" />
      <circle cx="256" cy="256" r="150" fill="#FFFFFF" />
      <circle cx="256" cy="256" r="90" fill="#0B6E4F" />
      <rect x="322" y="172" width="95" height="168" fill="#0B6E4F" />
    </svg>
  )

  if (isIcon) {
    if (href) {
      return (
        <Link href={href} className={`inline-flex items-center ${className}`}>
          {IconComponent}
        </Link>
      )
    }
    return <div className={`inline-flex items-center ${className}`}>{IconComponent}</div>
  }

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {IconComponent}
      <div className="flex flex-col leading-none">
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: `${Math.max(16, size * 0.7)}px` }}
        >
          chiron
        </span>
        {showSubtext && (
          <span
            className="font-medium text-muted-foreground tracking-wider uppercase mt-0.5"
            style={{ fontSize: `${Math.max(9, size * 0.3)}px` }}
          >
            by Theia
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}
