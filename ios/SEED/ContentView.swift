import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            AtmosphereBackground()

            VStack(alignment: .leading, spacing: 16) {
                Text("SEED")
                    .font(.system(size: 56, weight: .bold, design: .rounded))
                    .foregroundStyle(Color(red: 0.06, green: 0.14, blue: 0.11))
                    .tracking(-1.5)
                    .accessibilityAddTraits(.isHeader)

                Text("Hello World")
                    .font(.system(size: 34, weight: .semibold, design: .rounded))
                    .foregroundStyle(Color(red: 0.05, green: 0.48, blue: 0.37))

                Text("長期關注產品或 KOL 知識，把專業累積成一本可分享的知識書。")
                    .font(.system(size: 17, weight: .regular, design: .default))
                    .foregroundStyle(Color(red: 0.24, green: 0.35, blue: 0.30))
                    .lineSpacing(4)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
            .padding(.horizontal, 28)
            .padding(.vertical, 48)
        }
        .ignoresSafeArea()
    }
}

private struct AtmosphereBackground: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.84, green: 0.92, blue: 0.89),
                    Color(red: 0.93, green: 0.96, blue: 0.95),
                    Color(red: 0.81, green: 0.89, blue: 0.86)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color(red: 0.49, green: 0.79, blue: 0.69).opacity(0.7),
                            .clear
                        ],
                        center: .center,
                        startRadius: 20,
                        endRadius: 220
                    )
                )
                .frame(width: 420, height: 420)
                .offset(x: 120, y: -180)
                .blur(radius: 28)

            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color(red: 0.66, green: 0.83, blue: 0.77).opacity(0.65),
                            .clear
                        ],
                        center: .center,
                        startRadius: 10,
                        endRadius: 180
                    )
                )
                .frame(width: 340, height: 340)
                .offset(x: -140, y: 260)
                .blur(radius: 32)
        }
    }
}

#Preview {
    ContentView()
}
