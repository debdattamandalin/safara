import re

def fix_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        if isinstance(old, re.Pattern):
            content = old.sub(new, content)
        else:
            content = content.replace(old, new)
            
    with open(filepath, 'w') as f:
        f.write(content)

# Onboarding.tsx
fix_file('src/pages/Onboarding.tsx', [
    ("MapPin, UserSquare2, Globe, HeartPulse, ShieldCheck, Bell, CheckCircle2", "MapPin, UserSquare2, Globe, ShieldCheck, Bell, CheckCircle2")
])

# TravelerHome.tsx
fix_file('src/pages/TravelerHome.tsx', [
    ("import React, { useEffect, useState, useRef }", "import React, { useEffect, useState, useCallback }"),
    ("import { ShieldAlert, Navigation, AlertTriangle, ShieldCheck }", "import { ShieldAlert, AlertTriangle, ShieldCheck }"),
    ("import { MockBackend, type TravelerLocation }", "import { MockBackend }"),
    ("const [sosActive, setSosActive] = useState(false);", ""),
    ("const id = await Geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 10000 }, (pos, err) => {", "const id = await Geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 10000 }, (pos, _err) => {"),
    (re.compile(r"  const stopJourney = async \(\) => \{[\s\S]*?  \};\n\n"), ""),
    (re.compile(r"  const triggerSOS = \(\) => \{[\s\S]*?  \};\n\n"), ""),
    (re.compile(r"const startJourney = async \(\) => \{"), "const startJourney = useCallback(async () => {"),
    (re.compile(r"    \}\n  \};\n\n"), "    }\n  }, [digitalId]);\n\n"),
    ("}, [digitalId, isTracking]);", "}, [digitalId, isTracking, startJourney]);")
])

# ImmigrationVerify.tsx
fix_file('src/pages/ImmigrationVerify.tsx', [
    ("const [isScanning, setIsScanning] = useState(false);", ""),
    ("const accountData = JSON.parse(accountDataRaw);", "JSON.parse(accountDataRaw);")
])

# i18n.ts
fix_file('src/i18n.ts', [
    ("} catch (e) {}", "} catch (_e) {}")
])

# GlobalSOSOverlay.tsx
fix_file('src/components/GlobalSOSOverlay.tsx', [
    ("} catch(e) {", "} catch(_e) {"),
    (re.compile(r"  const executeSOS = async \(\) => \{"), "  const executeSOS = React.useCallback(async () => {"),
    (re.compile(r"    \}\n  \};\n\n"), "    }\n  }, [digitalId]);\n\n"),
    ("}, [sosState, countdown]);", "}, [sosState, countdown, executeSOS]);")
])

# AdminLayout.tsx
fix_file('src/layouts/AdminLayout.tsx', [
    ("import { ShieldAlert, Activity, Users, Map as MapIcon, ArrowLeft }", "import { ShieldAlert, Activity, Users, Map as MapIcon }"),
    ("const navigate = useNavigate();", "")
])

print("Lint warnings fixed.")
